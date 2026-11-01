import test from 'node:test';
import assert from 'node:assert/strict';
import {ConnectionManager,formatUSBInfo,SERIAL_OPTIONS} from '../connection.js';

function fakeSerial({failOpen=false,failClose=false,cancel=false}={}){
  const listeners=new Map(),events=[],port={
    opened:false,closeCount:0,
    getInfo:()=>({usbVendorId:0x1A86,usbProductId:0x7523}),
    async open(options){events.push(['open',options]);if(failOpen)throw Error('Port busy');this.opened=true;},
    async close(){this.closeCount++;if(failClose)throw Error('Close blocked');this.opened=false;}
  };
  const serial={
    addEventListener:(name,fn)=>listeners.set(name,fn),
    removeEventListener:name=>listeners.delete(name),
    async requestPort(){if(cancel){const error=Error('Cancelled');error.name='NotFoundError';throw error;}return port;},
    unplug(){listeners.get('disconnect')?.({port});}
  };
  return {serial,port,events,listeners};
}
test('USB info is formatted without claiming radio identity',()=>{
  assert.deepEqual(formatUSBInfo({usbVendorId:0x1a86,usbProductId:0x7523}),{vendorId:'0x1A86',productId:'0x7523'});
  assert.equal(formatUSBInfo({}).vendorId,'Unavailable');
});
test('USB connection opens only transport and disconnect closes it',async()=>{
  const fake=fakeSerial(),snapshots=[],logs=[];
  const manager=new ConnectionManager({serial:fake.serial,onChange:s=>snapshots.push(s),onLog:line=>logs.push(line)});
  await manager.connectUSB();
  assert.equal(manager.snapshot().state,'connected');
  assert.equal(manager.snapshot().info.vendorId,'0x1A86');
  assert.deepEqual(fake.events,[['open',SERIAL_OPTIONS]]);
  assert.equal(fake.port.opened,true);
  await manager.disconnect();
  assert.equal(fake.port.opened,false);
  assert.equal(manager.snapshot().state,'disconnected');
  assert.deepEqual(snapshots.map(s=>s.state),['connecting','connected','disconnecting','disconnected']);
  manager.dispose();
  assert.equal(fake.listeners.size,0);
});
test('simulation never requests a physical port',async()=>{
  const fake=fakeSerial(),manager=new ConnectionManager({serial:fake.serial});
  manager.connectSimulator();
  assert.equal(manager.snapshot().mode,'simulation');
  assert.equal(manager.snapshot().baudRate,null);
  assert.deepEqual(fake.events,[]);
  await manager.disconnect();
  assert.equal(manager.snapshot().state,'disconnected');
});
test('unsupported browser fails without changing state',async()=>{
  const manager=new ConnectionManager();
  await assert.rejects(manager.connectUSB(),/Web Serial is unavailable/);
  assert.equal(manager.snapshot().state,'disconnected');
});
test('port picker cancellation resets state',async()=>{
  const fake=fakeSerial({cancel:true}),logs=[],manager=new ConnectionManager({serial:fake.serial,onLog:x=>logs.push(x)});
  await manager.connectUSB();
  assert.equal(manager.snapshot().state,'disconnected');
  assert.match(logs[0],/cancelled/);
});
test('open failure closes port and resets state',async()=>{
  const fake=fakeSerial({failOpen:true}),manager=new ConnectionManager({serial:fake.serial});
  await assert.rejects(manager.connectUSB(),/Port busy/);
  assert.equal(fake.port.closeCount,1);
  assert.equal(manager.snapshot().state,'disconnected');
});
test('USB unplug clears connection state',async()=>{
  const fake=fakeSerial(),manager=new ConnectionManager({serial:fake.serial});
  await manager.connectUSB();
  fake.serial.unplug();
  assert.equal(manager.snapshot().state,'disconnected');
  assert.equal(manager.snapshot().mode,null);
});
test('failed close does not claim disconnected',async()=>{
  const fake=fakeSerial({failClose:true}),manager=new ConnectionManager({serial:fake.serial});
  await manager.connectUSB();
  await assert.rejects(manager.disconnect(),/Close blocked/);
  assert.equal(manager.snapshot().state,'connected');
});
test('cannot connect twice',async()=>{
  const manager=new ConnectionManager();
  manager.connectSimulator();
  assert.throws(()=>manager.connectSimulator(),/Disconnect/);
  await assert.rejects(manager.connectUSB(),/Disconnect/);
});
