import type { Meta, StoryObj } from '@storybook/react';

import { SpeechTranscriber } from './SpeechTranscriber';

const meta = {
  title: 'Components/SpeechTranscriber',
  component: SpeechTranscriber,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    language: {
      control: 'select',
      options: ['en-US', 'es-ES', 'fr-FR', 'de-DE', 'it-IT'],
      description: 'Language for speech recognition',
    },
    continuous: {
      control: 'boolean',
      description: 'Whether to continuously listen for speech',
    },
  },
} satisfies Meta<typeof SpeechTranscriber>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    language: 'en-US',
    continuous: true,
  },
};

export const Spanish: Story = {
  args: {
    language: 'es-ES',
    continuous: true,
  },
};

export const NonContinuous: Story = {
  args: {
    language: 'en-US',
    continuous: false,
  },
};
