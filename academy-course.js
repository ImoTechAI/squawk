// Original SQUAWK study summaries. Cross-check exam requirements with current RSGB/Ofcom documents.
export const COURSES=[
  {
    "id": "foundation",
    "title": "Foundation",
    "intro": "Beginner concepts and safe, responsible operation.",
    "detail": "Focus on recognition, simple calculations and practical operating habits.",
    "lessons": [
      {
        "id": "foundation-licensing",
        "title": "Licensing and identification",
        "overview": "A UK amateur licence sets conditions for transmitting, including identification, permitted frequencies, power and responsibilities. Always check your own current Ofcom licence schedule before operating.",
        "example": "A stored channel or a published band plan does not replace a licence. Before transmitting, check both the authorised allocation and the equipment.",
        "question": {
          "prompt": "Which document determines your personal amateur transmission privileges?",
          "choices": [
            "Your current Ofcom amateur radio licence",
            "A radio manufacturer's brochure",
            "A frequency directory"
          ],
          "answer": 0,
          "explanation": "Review the concept: A UK amateur licence sets conditions for transmitting, including identification, permitted frequencies, power and responsibilities. Always check your own current Ofcom licence schedule before operating."
        }
      },
      {
        "id": "foundation-technical",
        "title": "Technical fundamentals",
        "overview": "Voltage is electrical potential difference, current is the flow of charge, and resistance opposes current. Ohm's law is V = I × R; power is P = V × I.",
        "example": "A 12 V supply across a 6 Ω resistance produces 2 A. The power dissipated is 24 W; components must be rated accordingly.",
        "question": {
          "prompt": "A 12 V supply across a 6 Ω resistor produces what current?",
          "choices": [
            "0.5 A",
            "2 A",
            "72 A"
          ],
          "answer": 1,
          "explanation": "Review the concept: Voltage is electrical potential difference, current is the flow of charge, and resistance opposes current. Ohm's law is V = I × R; power is P = V × I."
        }
      },
      {
        "id": "foundation-transceivers",
        "title": "Transmitters and receivers",
        "overview": "A transmitter generates and modulates an RF carrier. A receiver selects and demodulates the signal. AM varies amplitude, FM varies instantaneous frequency and SSB suppresses a carrier and sideband.",
        "example": "Selecting NFM in a channel memory affects modulation bandwidth, not the right to transmit. Match mode and channel plan.",
        "question": {
          "prompt": "Which modulation primarily varies carrier frequency?",
          "choices": [
            "AM",
            "FM",
            "SSB"
          ],
          "answer": 1,
          "explanation": "Review the concept: A transmitter generates and modulates an RF carrier. A receiver selects and demodulates the signal. AM varies amplitude, FM varies instantaneous frequency and SSB suppresses a carrier and sideband."
        }
      },
      {
        "id": "foundation-antennas",
        "title": "Feeders and antennas",
        "overview": "An antenna converts RF electrical energy into electromagnetic waves and back. Feeder losses reduce power reaching the antenna. Poor impedance matching causes reflections, often expressed as SWR.",
        "example": "A higher antenna may improve VHF line-of-sight coverage, while a damaged feeder can undo much of that benefit.",
        "question": {
          "prompt": "What commonly increases loss between transmitter and antenna?",
          "choices": [
            "Long or damaged coaxial feeder",
            "Correct antenna matching",
            "Shorter low-loss feeder"
          ],
          "answer": 0,
          "explanation": "Review the concept: An antenna converts RF electrical energy into electromagnetic waves and back. Feeder losses reduce power reaching the antenna. Poor impedance matching causes reflections, often expressed as SWR."
        }
      },
      {
        "id": "foundation-propagation",
        "title": "Radio propagation",
        "overview": "HF can be refracted by the ionosphere over long distances. VHF and UHF often depend on line of sight but can also experience diffraction, reflections and occasional enhanced propagation.",
        "example": "Two handhelds in a valley may struggle despite being nearby; moving to higher ground can improve their radio path.",
        "question": {
          "prompt": "What is a common cause of poor VHF coverage?",
          "choices": [
            "A blocked line-of-sight path",
            "A larger display screen",
            "A saved channel name"
          ],
          "answer": 0,
          "explanation": "Review the concept: HF can be refracted by the ionosphere over long distances. VHF and UHF often depend on line of sight but can also experience diffraction, reflections and occasional enhanced propagation."
        }
      },
      {
        "id": "foundation-emc",
        "title": "Electromagnetic compatibility",
        "overview": "Radio signals can interfere with nearby equipment through radiated or conducted paths. Good filtering, screened cables, sound connections and suitable antenna placement help reduce problems.",
        "example": "A ferrite choke on a cable may suppress unwanted common-mode RF currents, but is not a substitute for correcting a faulty transmitter.",
        "question": {
          "prompt": "What can help reduce unwanted RF currents on a cable?",
          "choices": [
            "A ferrite choke",
            "A louder speaker",
            "A brighter screen"
          ],
          "answer": 0,
          "explanation": "Review the concept: Radio signals can interfere with nearby equipment through radiated or conducted paths. Good filtering, screened cables, sound connections and suitable antenna placement help reduce problems."
        }
      },
      {
        "id": "foundation-operating",
        "title": "Operating procedures",
        "overview": "Use clear call signs, listen before transmitting and keep transmissions concise. Repeaters commonly use separate input and output frequencies and sometimes an access tone.",
        "example": "When calling through a repeater, ensure offset and access tone match its published settings; never assume a frequency is available.",
        "question": {
          "prompt": "Before transmitting on a shared amateur frequency, what should you do?",
          "choices": [
            "Listen to check whether it is in use",
            "Transmit a long test immediately",
            "Disable your receiver"
          ],
          "answer": 0,
          "explanation": "Review the concept: Use clear call signs, listen before transmitting and keep transmissions concise. Repeaters commonly use separate input and output frequencies and sometimes an access tone."
        }
      },
      {
        "id": "foundation-safety",
        "title": "Station safety",
        "overview": "Electrical safety includes suitable fuses, safe batteries, sound cabling and keeping antennas away from overhead power lines. RF exposure compliance must be considered for transmitting stations.",
        "example": "A portable mast near an overhead line is hazardous even when the radio is switched off. Keep a safe distance and choose another site.",
        "question": {
          "prompt": "Which is a serious antenna-installation hazard?",
          "choices": [
            "Overhead power lines",
            "A correctly labelled channel",
            "A low-volume speaker"
          ],
          "answer": 0,
          "explanation": "Review the concept: Electrical safety includes suitable fuses, safe batteries, sound cabling and keeping antennas away from overhead power lines. RF exposure compliance must be considered for transmitting stations."
        }
      },
      {
        "id": "foundation-measurement",
        "title": "Measurements and construction",
        "overview": "A multimeter measures quantities such as voltage, resistance and current when connected correctly. Decibels express ratios; a 3 dB increase in power is approximately a doubling.",
        "example": "Never connect a multimeter set to current measurement directly across a battery; this can create a short circuit.",
        "question": {
          "prompt": "What does an approximately 3 dB power increase represent?",
          "choices": [
            "About double the power",
            "Half the power",
            "Ten times the power"
          ],
          "answer": 0,
          "explanation": "Review the concept: A multimeter measures quantities such as voltage, resistance and current when connected correctly. Decibels express ratios; a 3 dB increase in power is approximately a doubling."
        }
      }
    ]
  },
  {
    "id": "intermediate",
    "title": "Intermediate",
    "intro": "Extend the same nine syllabus areas with deeper theory.",
    "detail": "Investigate circuits, reactance, matching, transmitter stages, interference diagnosis and propagation mechanisms.",
    "lessons": [
      {
        "id": "intermediate-licensing",
        "title": "Licensing and identification",
        "overview": "Explore supervision and station responsibilities, licence variations and interference reporting.",
        "example": "Foundation recap: A UK amateur licence sets conditions for transmitting, including identification, permitted frequencies, power and responsibilities. Always check your own current Ofcom licence schedule before operating. Advanced study: Explore supervision and station responsibilities, licence variations and interference reporting.",
        "question": {
          "prompt": "Which document determines your personal amateur transmission privileges?",
          "choices": [
            "Your current Ofcom amateur radio licence",
            "A radio manufacturer's brochure",
            "A frequency directory"
          ],
          "answer": 0,
          "explanation": "Review the concept: A UK amateur licence sets conditions for transmitting, including identification, permitted frequencies, power and responsibilities. Always check your own current Ofcom licence schedule before operating."
        }
      },
      {
        "id": "intermediate-technical",
        "title": "Technical fundamentals",
        "overview": "Extend Ohm's law to series and parallel networks; investigate capacitors, inductors, reactance and tuned circuits.",
        "example": "Foundation recap: Voltage is electrical potential difference, current is the flow of charge, and resistance opposes current. Ohm's law is V = I × R; power is P = V × I. Advanced study: Extend Ohm's law to series and parallel networks; investigate capacitors, inductors, reactance and tuned circuits.",
        "question": {
          "prompt": "A 12 V supply across a 6 Ω resistor produces what current?",
          "choices": [
            "0.5 A",
            "2 A",
            "72 A"
          ],
          "answer": 1,
          "explanation": "Review the concept: Voltage is electrical potential difference, current is the flow of charge, and resistance opposes current. Ohm's law is V = I × R; power is P = V × I."
        }
      },
      {
        "id": "intermediate-transceivers",
        "title": "Transmitters and receivers",
        "overview": "Compare oscillator stability, harmonics, amplifier efficiency and superheterodyne receiver stages.",
        "example": "Foundation recap: A transmitter generates and modulates an RF carrier. A receiver selects and demodulates the signal. AM varies amplitude, FM varies instantaneous frequency and SSB suppresses a carrier and sideband. Advanced study: Compare oscillator stability, harmonics, amplifier efficiency and superheterodyne receiver stages.",
        "question": {
          "prompt": "Which modulation primarily varies carrier frequency?",
          "choices": [
            "AM",
            "FM",
            "SSB"
          ],
          "answer": 1,
          "explanation": "Review the concept: A transmitter generates and modulates an RF carrier. A receiver selects and demodulates the signal. AM varies amplitude, FM varies instantaneous frequency and SSB suppresses a carrier and sideband."
        }
      },
      {
        "id": "intermediate-antennas",
        "title": "Feeders and antennas",
        "overview": "Compare balanced and unbalanced feeders, baluns, EIRP, impedance transformation and feeder attenuation.",
        "example": "Foundation recap: An antenna converts RF electrical energy into electromagnetic waves and back. Feeder losses reduce power reaching the antenna. Poor impedance matching causes reflections, often expressed as SWR. Advanced study: Compare balanced and unbalanced feeders, baluns, EIRP, impedance transformation and feeder attenuation.",
        "question": {
          "prompt": "What commonly increases loss between transmitter and antenna?",
          "choices": [
            "Long or damaged coaxial feeder",
            "Correct antenna matching",
            "Shorter low-loss feeder"
          ],
          "answer": 0,
          "explanation": "Review the concept: An antenna converts RF electrical energy into electromagnetic waves and back. Feeder losses reduce power reaching the antenna. Poor impedance matching causes reflections, often expressed as SWR."
        }
      },
      {
        "id": "intermediate-propagation",
        "title": "Radio propagation",
        "overview": "Study ionospheric D, E and F regions, fading, maximum usable frequency and sporadic-E propagation.",
        "example": "Foundation recap: HF can be refracted by the ionosphere over long distances. VHF and UHF often depend on line of sight but can also experience diffraction, reflections and occasional enhanced propagation. Advanced study: Study ionospheric D, E and F regions, fading, maximum usable frequency and sporadic-E propagation.",
        "question": {
          "prompt": "What is a common cause of poor VHF coverage?",
          "choices": [
            "A blocked line-of-sight path",
            "A larger display screen",
            "A saved channel name"
          ],
          "answer": 0,
          "explanation": "Review the concept: HF can be refracted by the ionosphere over long distances. VHF and UHF often depend on line of sight but can also experience diffraction, reflections and occasional enhanced propagation."
        }
      },
      {
        "id": "intermediate-emc",
        "title": "Electromagnetic compatibility",
        "overview": "Identify common-mode and differential-mode coupling, screening, RF earths and filter placement.",
        "example": "Foundation recap: Radio signals can interfere with nearby equipment through radiated or conducted paths. Good filtering, screened cables, sound connections and suitable antenna placement help reduce problems. Advanced study: Identify common-mode and differential-mode coupling, screening, RF earths and filter placement.",
        "question": {
          "prompt": "What can help reduce unwanted RF currents on a cable?",
          "choices": [
            "A ferrite choke",
            "A louder speaker",
            "A brighter screen"
          ],
          "answer": 0,
          "explanation": "Review the concept: Radio signals can interfere with nearby equipment through radiated or conducted paths. Good filtering, screened cables, sound connections and suitable antenna placement help reduce problems."
        }
      },
      {
        "id": "intermediate-operating",
        "title": "Operating procedures",
        "overview": "Study contest procedures, satellites, digital modes, Q codes and international operating limitations.",
        "example": "Foundation recap: Use clear call signs, listen before transmitting and keep transmissions concise. Repeaters commonly use separate input and output frequencies and sometimes an access tone. Advanced study: Study contest procedures, satellites, digital modes, Q codes and international operating limitations.",
        "question": {
          "prompt": "Before transmitting on a shared amateur frequency, what should you do?",
          "choices": [
            "Listen to check whether it is in use",
            "Transmit a long test immediately",
            "Disable your receiver"
          ],
          "answer": 0,
          "explanation": "Review the concept: Use clear call signs, listen before transmitting and keep transmissions concise. Repeaters commonly use separate input and output frequencies and sometimes an access tone."
        }
      },
      {
        "id": "intermediate-safety",
        "title": "Station safety",
        "overview": "Examine capacitor discharge, battery short-circuit protection, EMF assessment and safe maintenance.",
        "example": "Foundation recap: Electrical safety includes suitable fuses, safe batteries, sound cabling and keeping antennas away from overhead power lines. RF exposure compliance must be considered for transmitting stations. Advanced study: Examine capacitor discharge, battery short-circuit protection, EMF assessment and safe maintenance.",
        "question": {
          "prompt": "Which is a serious antenna-installation hazard?",
          "choices": [
            "Overhead power lines",
            "A correctly labelled channel",
            "A low-volume speaker"
          ],
          "answer": 0,
          "explanation": "Review the concept: Electrical safety includes suitable fuses, safe batteries, sound cabling and keeping antennas away from overhead power lines. RF exposure compliance must be considered for transmitting stations."
        }
      },
      {
        "id": "intermediate-measurement",
        "title": "Measurements and construction",
        "overview": "Use meters safely; interpret dB, dBi, dBd and resistor markings; practise basic soldering.",
        "example": "Foundation recap: A multimeter measures quantities such as voltage, resistance and current when connected correctly. Decibels express ratios; a 3 dB increase in power is approximately a doubling. Advanced study: Use meters safely; interpret dB, dBi, dBd and resistor markings; practise basic soldering.",
        "question": {
          "prompt": "What does an approximately 3 dB power increase represent?",
          "choices": [
            "About double the power",
            "Half the power",
            "Ten times the power"
          ],
          "answer": 0,
          "explanation": "Review the concept: A multimeter measures quantities such as voltage, resistance and current when connected correctly. Decibels express ratios; a 3 dB increase in power is approximately a doubling."
        }
      }
    ]
  },
  {
    "id": "full",
    "title": "Full",
    "intro": "Advanced engineering and station management.",
    "detail": "Analyse impedance, receiver architecture, modulation performance, EMC and RF safety with greater technical precision.",
    "lessons": [
      {
        "id": "full-licensing",
        "title": "Licensing and identification",
        "overview": "Assess licence obligations, remote operation, interference controls and RF exposure documentation.",
        "example": "Foundation recap: A UK amateur licence sets conditions for transmitting, including identification, permitted frequencies, power and responsibilities. Always check your own current Ofcom licence schedule before operating. Advanced study: Assess licence obligations, remote operation, interference controls and RF exposure documentation.",
        "question": {
          "prompt": "Which document determines your personal amateur transmission privileges?",
          "choices": [
            "Your current Ofcom amateur radio licence",
            "A radio manufacturer's brochure",
            "A frequency directory"
          ],
          "answer": 0,
          "explanation": "Review the concept: A UK amateur licence sets conditions for transmitting, including identification, permitted frequencies, power and responsibilities. Always check your own current Ofcom licence schedule before operating."
        }
      },
      {
        "id": "full-technical",
        "title": "Technical fundamentals",
        "overview": "Analyse AC impedance, resonance, time constants, transformers, semiconductor stages and digital sampling.",
        "example": "Foundation recap: Voltage is electrical potential difference, current is the flow of charge, and resistance opposes current. Ohm's law is V = I × R; power is P = V × I. Advanced study: Analyse AC impedance, resonance, time constants, transformers, semiconductor stages and digital sampling.",
        "question": {
          "prompt": "A 12 V supply across a 6 Ω resistor produces what current?",
          "choices": [
            "0.5 A",
            "2 A",
            "72 A"
          ],
          "answer": 1,
          "explanation": "Review the concept: Voltage is electrical potential difference, current is the flow of charge, and resistance opposes current. Ohm's law is V = I × R; power is P = V × I."
        }
      },
      {
        "id": "full-transceivers",
        "title": "Transmitters and receivers",
        "overview": "Study PLL/DDS synthesis, receiver dynamic range, SDR I/Q, image frequencies and modulation linearity.",
        "example": "Foundation recap: A transmitter generates and modulates an RF carrier. A receiver selects and demodulates the signal. AM varies amplitude, FM varies instantaneous frequency and SSB suppresses a carrier and sideband. Advanced study: Study PLL/DDS synthesis, receiver dynamic range, SDR I/Q, image frequencies and modulation linearity.",
        "question": {
          "prompt": "Which modulation primarily varies carrier frequency?",
          "choices": [
            "AM",
            "FM",
            "SSB"
          ],
          "answer": 1,
          "explanation": "Review the concept: A transmitter generates and modulates an RF carrier. A receiver selects and demodulates the signal. AM varies amplitude, FM varies instantaneous frequency and SSB suppresses a carrier and sideband."
        }
      },
      {
        "id": "full-antennas",
        "title": "Feeders and antennas",
        "overview": "Calculate feeder losses and standing-wave effects; analyse antenna patterns, gain and matching networks.",
        "example": "Foundation recap: An antenna converts RF electrical energy into electromagnetic waves and back. Feeder losses reduce power reaching the antenna. Poor impedance matching causes reflections, often expressed as SWR. Advanced study: Calculate feeder losses and standing-wave effects; analyse antenna patterns, gain and matching networks.",
        "question": {
          "prompt": "What commonly increases loss between transmitter and antenna?",
          "choices": [
            "Long or damaged coaxial feeder",
            "Correct antenna matching",
            "Shorter low-loss feeder"
          ],
          "answer": 0,
          "explanation": "Review the concept: An antenna converts RF electrical energy into electromagnetic waves and back. Feeder losses reduce power reaching the antenna. Poor impedance matching causes reflections, often expressed as SWR."
        }
      },
      {
        "id": "full-propagation",
        "title": "Radio propagation",
        "overview": "Evaluate ionospheric conditions, multipath, fading and propagation prediction limits.",
        "example": "Foundation recap: HF can be refracted by the ionosphere over long distances. VHF and UHF often depend on line of sight but can also experience diffraction, reflections and occasional enhanced propagation. Advanced study: Evaluate ionospheric conditions, multipath, fading and propagation prediction limits.",
        "question": {
          "prompt": "What is a common cause of poor VHF coverage?",
          "choices": [
            "A blocked line-of-sight path",
            "A larger display screen",
            "A saved channel name"
          ],
          "answer": 0,
          "explanation": "Review the concept: HF can be refracted by the ionosphere over long distances. VHF and UHF often depend on line of sight but can also experience diffraction, reflections and occasional enhanced propagation."
        }
      },
      {
        "id": "full-emc",
        "title": "Electromagnetic compatibility",
        "overview": "Diagnose radiated and conducted interference, filtering, screening and transmitter spurious emissions.",
        "example": "Foundation recap: Radio signals can interfere with nearby equipment through radiated or conducted paths. Good filtering, screened cables, sound connections and suitable antenna placement help reduce problems. Advanced study: Diagnose radiated and conducted interference, filtering, screening and transmitter spurious emissions.",
        "question": {
          "prompt": "What can help reduce unwanted RF currents on a cable?",
          "choices": [
            "A ferrite choke",
            "A louder speaker",
            "A brighter screen"
          ],
          "answer": 0,
          "explanation": "Review the concept: Radio signals can interfere with nearby equipment through radiated or conducted paths. Good filtering, screened cables, sound connections and suitable antenna placement help reduce problems."
        }
      },
      {
        "id": "full-operating",
        "title": "Operating procedures",
        "overview": "Apply rigorous station identification, international operating rules, satellites and emergency procedure boundaries.",
        "example": "Foundation recap: Use clear call signs, listen before transmitting and keep transmissions concise. Repeaters commonly use separate input and output frequencies and sometimes an access tone. Advanced study: Apply rigorous station identification, international operating rules, satellites and emergency procedure boundaries.",
        "question": {
          "prompt": "Before transmitting on a shared amateur frequency, what should you do?",
          "choices": [
            "Listen to check whether it is in use",
            "Transmit a long test immediately",
            "Disable your receiver"
          ],
          "answer": 0,
          "explanation": "Review the concept: Use clear call signs, listen before transmitting and keep transmissions concise. Repeaters commonly use separate input and output frequencies and sometimes an access tone."
        }
      },
      {
        "id": "full-safety",
        "title": "Station safety",
        "overview": "Evaluate RF exposure, electrical isolation, high-voltage equipment and site risk controls.",
        "example": "Foundation recap: Electrical safety includes suitable fuses, safe batteries, sound cabling and keeping antennas away from overhead power lines. RF exposure compliance must be considered for transmitting stations. Advanced study: Evaluate RF exposure, electrical isolation, high-voltage equipment and site risk controls.",
        "question": {
          "prompt": "Which is a serious antenna-installation hazard?",
          "choices": [
            "Overhead power lines",
            "A correctly labelled channel",
            "A low-volume speaker"
          ],
          "answer": 0,
          "explanation": "Review the concept: Electrical safety includes suitable fuses, safe batteries, sound cabling and keeping antennas away from overhead power lines. RF exposure compliance must be considered for transmitting stations."
        }
      },
      {
        "id": "full-measurement",
        "title": "Measurements and construction",
        "overview": "Use calibrated measurement methods, oscilloscopes, RF power measurement and safe construction practices.",
        "example": "Foundation recap: A multimeter measures quantities such as voltage, resistance and current when connected correctly. Decibels express ratios; a 3 dB increase in power is approximately a doubling. Advanced study: Use calibrated measurement methods, oscilloscopes, RF power measurement and safe construction practices.",
        "question": {
          "prompt": "What does an approximately 3 dB power increase represent?",
          "choices": [
            "About double the power",
            "Half the power",
            "Ten times the power"
          ],
          "answer": 0,
          "explanation": "Review the concept: A multimeter measures quantities such as voltage, resistance and current when connected correctly. Decibels express ratios; a 3 dB increase in power is approximately a doubling."
        }
      }
    ]
  }
];
export const EXAM_SPECS=Object.freeze({foundation:{count:26,pass:19,minutes:60},intermediate:{count:46,pass:28,minutes:90},full:{count:58,pass:35,minutes:120}});
export const RESOURCES=Object.freeze([{label:'RSGB exam specifications',url:'https://rsgb.org/main/clubs-training/for-trainers/syllabus-2019/'},{label:'RSGB mock examination papers',url:'https://rsgb.org/main/clubs-training/training-resources/mock-exams/'},{label:'UKHamQuiz practice',url:'https://www.ukhamquiz.com/quiz'}]);
export function scoreQuiz(questions,answers){let correct=0;const results=questions.map(q=>{const choice=answers?.[q.id];const answered=Number.isInteger(choice)&&choice>=0&&choice<q.choices.length;const right=answered&&choice===q.answer;if(right)correct++;return {id:q.id,answered,correct:right,explanation:q.explanation};});return {correct,total:questions.length,complete:results.every(r=>r.answered),results};}
export function lessonQuestions(course){return course.lessons.map(l=>({...l.question,id:l.id}));}
export function practiceResult(course,answers){const result=scoreQuiz(lessonQuestions(course),answers);return {...result,percentage:result.total?Math.round(100*result.correct/result.total):0};}
