import { useReducer, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./EnigmaPage.css";
import InfoHint from "../components/common/InfoHint";
import { byPrefixAndName } from "../icons/fontAwesome";
import InfoModal from "../components/common/InfoModal";
import {
  Enigma,
  Plugboard,
  Reflector,
  Rotor,
  createDefaultEnigma,
} from "../services/enigma";
import PlugboardPanel from "../components/enigma/PlugboardPanel";
import ReflectorPanel from "../components/enigma/ReflectorPanel";
import RotorPanel from "../components/enigma/RotorPanel";

type InfoDetails = {
  title: string;
  description: string;
} | null;

type MessageResult = {
  output: string;
  startWindow: string;
  finalWindow: string;
  keypressCount: number;
};

function formatRotorWindow(rotations: number[]): string {
  return rotations
    .map((rotation) => String.fromCharCode(65 + rotation))
    .join(" | ");
}

function cloneMachine(machine: Enigma): Enigma {
  const clonedRotors = machine.getRotors().map(
    (rotor) =>
      new Rotor({
        name: rotor.name,
        encoding: rotor.encoding,
        turnoverPosition: rotor.turnoverPosition,
        startPosition: rotor.rotation,
        ringSetting: rotor.ringSetting,
      }),
  );

  const clonedReflector = new Reflector({
    name: machine.getReflector().name,
    encoding: machine.getReflector().encoding,
  });

  const clonedPlugboard = new Plugboard();
  const cablePairs = machine
    .getPlugboard()
    .getPairedCharacters()
    .filter((pair) => pair[0] < pair[1]);

  for (const pair of cablePairs) {
    clonedPlugboard.addCable(pair.charCodeAt(0) - 65, pair.charCodeAt(1) - 65);
  }

  return new Enigma(clonedRotors, clonedPlugboard, clonedReflector);
}

function processMessage(machine: Enigma, message: string): MessageResult {
  const startRotation = machine.getCurrentRotation();
  const startWindow = formatRotorWindow(startRotation);

  if (message.length === 0) {
    return {
      output: "",
      startWindow,
      finalWindow: startWindow,
      keypressCount: 0,
    };
  }

  const workingMachine = cloneMachine(machine);
  const output = workingMachine.encode(message);
  const finalWindow = formatRotorWindow(workingMachine.getCurrentRotation());
  const keypressCount = (message.match(/[a-z]/gi) ?? []).length;

  return {
    output,
    startWindow,
    finalWindow,
    keypressCount,
  };
}

export default function EnigmaPage() {
  const [machine] = useState(() => createDefaultEnigma());
  const [, forceUpdate] = useReducer((value: number) => value + 1, 0);
  const [inputText, setInputText] = useState("HELLO WORLD");
  const [infoDetails, setInfoDetails] = useState<InfoDetails>(null);

  const refresh = () => {
    forceUpdate();
  };

  const messageResult = processMessage(machine, inputText);

  const swapInputAndOutput = () => {
    setInputText(messageResult.output);
  };

  return (
    <div className="enigma-page">
      <section className="enigma-hero enigma-card">
        <div>
          <h1>Enigma Simulator</h1>
          <p className="enigma-hero-description">
            Configure rotors, reflector, and plugboard, then watch each keypress transform your message with live
            output and machine trace states.
          </p>
        </div>
      </section>

      <div className="enigma-layout">
        <section className="enigma-card enigma-control-card">
          <div className="enigma-card-header">
            <div>
              <div className="title-with-info">
                <h2 className="enigma-section-title">Encrypt</h2>
                <InfoHint
                  title="Encrypt"
                  description={
                    "How to use\n" +
                    "- Type or paste text in Input.\n" +
                    "- Output will update with the encrypted message\n" +
                    "- Use the swap button to swap input/output\n\n" +
                    "To decrypt\n" +
                    "- Keep the same rotor, reflector, and plugboard settings.\n" +
                    "- Enter your encrypted message into Input"
                  }
                  onOpen={(title, description) =>
                    setInfoDetails({ title, description })
                  }
                />
              </div>
            </div>
          </div>

          <div className="enigma-control-body">
            <div className="message-column">
              <label className="field message-input">
                <span className="subcard-label">Input</span>
                <textarea
                  rows={8}
                  value={inputText}
                  onChange={(event) => setInputText(event.target.value)}
                />
              </label>
            </div>

            <div className="message-swap">
              <button
                className="swap-button"
                type="button"
                onClick={swapInputAndOutput}
                disabled={!messageResult.output}
                aria-label="Swap input and output"
              >
                <FontAwesomeIcon
                  icon={byPrefixAndName.fas["rotate"]}
                  aria-hidden="true"
                />
              </button>
            </div>

            <div className="message-column">
              <label className="field message-output">
                <span className="subcard-label">Output</span>
                <textarea
                  rows={8}
                  readOnly
                  value={messageResult.output}
                  placeholder="No output yet"
                  spellCheck={false}
                />
              </label>
            </div>

            <div className="message-trace">
              <span className="subcard-label">Machine trace</span>
              <p>Ticks: {messageResult.keypressCount}</p>
              <p>Start (R-M-L): {messageResult.startWindow}</p>
              <p>Final (R-M-L): {messageResult.finalWindow}</p>
            </div>
          </div>
        </section>

        <section className="enigma-card enigma-config-pane">
          <div className="enigma-card-header">
            <div>
              <div className="title-with-info">
                <h2 className="enigma-section-title">Configure</h2>
                <InfoHint
                  title="Configure"
                  description={
                    "Configure the Enigma\n" +
                    "- Rotors\n" +
                    "- Reflector\n" +
                    "- Plugboard cabling\n\n"
                  }
                  onOpen={(title, description) =>
                    setInfoDetails({ title, description })
                  }
                />
              </div>
            </div>
          </div>

          <div className="enigma-machine-grid">
            <div className="enigma-machine-row enigma-machine-row-rotors">
              <RotorPanel machine={machine} onChange={refresh} />
            </div>

            <div className="enigma-machine-row enigma-machine-row-secondary">
              <ReflectorPanel machine={machine} onChange={refresh} />
              <PlugboardPanel machine={machine} onChange={refresh} />
            </div>
          </div>
        </section>
      </div>

      <InfoModal
        isOpen={infoDetails !== null}
        title={infoDetails?.title ?? ""}
        description={infoDetails?.description ?? ""}
        onClose={() => setInfoDetails(null)}
      />
    </div>
  );
}
