import { useState } from 'react';

import { SpeechTranscriber } from './SpeechTranscriber';
import classes from './SpeechTranscriberDemo.module.css';

export const SpeechTranscriberDemo = () => {
  const [transcription, setTranscription] = useState('');
  const [error, setError] = useState<Error | null>(null);

  const handleTranscription = (text: string) => {
    setTranscription(() => `${text}`);
  };

  const handleError = (error: Error) => {
    setError(error);
    console.error('Speech recognition error:', error);
  };

  return (
    <div className={classes.container}>
      <h2 className={classes.title}>Speech Transcriber Demo</h2>
      <div className={classes.transcriber}>
        <SpeechTranscriber
          language="en-US"
          continuous={true}
          onTranscription={handleTranscription}
          onError={handleError}
        />
      </div>
      <div className={classes.transcription}>
        <h3>Transcription:</h3>
        <p>{transcription || 'Start speaking to see transcription...'}</p>
      </div>
      {error && (
        <div className={classes.error}>
          <p>Error: {error.message}</p>
        </div>
      )}
    </div>
  );
};
