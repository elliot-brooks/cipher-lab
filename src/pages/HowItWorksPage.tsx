import './HowItWorksPage.css'

export default function HowItWorksPage() {
  return (
    <div className="how-page">
      <section className="how-card how-intro">
        <span className="how-kicker">How it works</span>
        <h1>Inside the Enigma machine</h1>
        <p>
          Enigma was used in the 20th century to protect military messages. Its strength came from rotating internal
          parts that changed the substitution after every key press.
        </p>
      </section>

      <section className="how-grid">
        <article className="how-card">
          <h2>The rotors</h2>
          <p>
            Rotors are moving substitution wheels. Each key press advances the right rotor, and at turnover positions it
            pushes the next rotor forward, creating the stepping behavior.
          </p>
          <pre className="how-code">{'Key press -> rotor step -> new path for the next letter'}</pre>
        </article>

        <article className="how-card">
          <h2>The reflector</h2>
          <p>
            After crossing the rotors, the signal hits the reflector and is sent back through the rotor stack on a
            different path.
          </p>
          <pre className="how-code">{'Keyboard -> rotors -> reflector -> rotors -> lampboard'}</pre>
        </article>

        <article className="how-card">
          <h2>The plugboard</h2>
          <p>
            The plugboard swaps selected letter pairs before and after the rotor path. Even a few cable changes can
            produce very different output.
          </p>
          <pre className="how-code">{'AB means A <-> B before and after rotor processing'}</pre>
        </article>

        <article className="how-card">
          <h2>Why encryption equals decryption</h2>
          <p>
            Enigma is symmetric: the same machine settings and starting state reverse the message. That is why this
            simulator uses one process operation for both directions.
          </p>
          <pre className="how-code">{'Plaintext -> ciphertext\nSame settings + ciphertext -> plaintext'}</pre>
        </article>
      </section>
    </div>
  )
}
