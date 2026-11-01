// Transport-only connection management. Never sends or reads radio commands.
export const SERIAL_OPTIONS=Object.freeze({baudRate:9600});
export function formatUSBInfo(info={}){
  const hex=value=>Number.isInteger(value)?'0x'+value.toString(16).toUpperCase().padStart(4,'0'):'Unavailable';
  return {vendorId:hex(info.usbVendorId),productId:hex(info.usbProductId)};
}
export class ConnectionManager {
  constructor({serial=null,onChange=()=>{},onLog=()=>{}}={}){
    this.serial=serial;this.onChange=onChange;this.onLog=onLog;
    this.port=null;this.state='disconnected';this.mode=null;this.info={};
    this.handleDisconnect=event=>{
      if(this.port && (event.port===this.port || event.target===this.port)){
        this.onLog('USB device disconnected');
        this.port=null;this.mode=null;this.info={};this.setState('disconnected');
      }
    };
    this.serial?.addEventListener?.('disconnect',this.handleDisconnect);
  }
  snapshot(){return {state:this.state,mode:this.mode,info:formatUSBInfo(this.info),baudRate:this.mode==='usb'?SERIAL_OPTIONS.baudRate:null};}
  setState(state){this.state=state;this.onChange(this.snapshot());}
  async connectUSB(){
    if(this.state!=='disconnected')throw Error('Disconnect before selecting another connection');
    if(!this.serial?.requestPort)throw Error('Web Serial is unavailable. Use desktop Chrome or Edge over HTTPS.');
    this.setState('connecting');
    let port;
    try{
      port=await this.serial.requestPort();
      if(!port){this.setState('disconnected');return;}
      await port.open(SERIAL_OPTIONS);
      this.port=port;this.mode='usb';this.info=port.getInfo?.()??{};
      this.onLog('USB serial port opened (transport only; no radio commands sent)');
      this.setState('connected');
    }catch(error){
      if(port)try{await port.close();}catch{}
      this.port=null;this.mode=null;this.info={};
      this.setState('disconnected');
      if(error?.name==='NotFoundError')this.onLog('USB port selection cancelled');
      else {this.onLog('USB connection failed: '+(error?.message??String(error)));throw error;}
    }
  }
  connectSimulator(){
    if(this.state!=='disconnected')throw Error('Disconnect before starting simulator');
    this.port=null;this.mode='simulation';this.info={};
    this.onLog('Simulated connection active; no physical radio is involved');
    this.setState('connected');
  }
  async disconnect(){
    if(this.state==='disconnected')return;
    if(this.state!=='connected')throw Error('Connection is busy');
    this.setState('disconnecting');
    const port=this.port;
    try{
      if(port)await port.close();
      this.onLog(this.mode==='simulation'?'Simulator stopped':'USB serial port closed');
    }catch(error){
      this.onLog('USB close failed: '+(error?.message??String(error)));
      // Do not claim a successful disconnect if the port cannot be closed.
      this.setState('connected');throw error;
    }
    this.port=null;this.mode=null;this.info={};this.setState('disconnected');
  }
  dispose(){this.serial?.removeEventListener?.('disconnect',this.handleDisconnect);}
}
