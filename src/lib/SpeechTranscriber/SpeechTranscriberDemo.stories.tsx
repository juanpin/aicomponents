import type { Meta, StoryObj } from '@storybook/react';

import { SpeechTranscriberDemo } from './SpeechTranscriberDemo';

const meta = {
  title: 'Components/SpeechTranscriberDemo',
  component: SpeechTranscriberDemo,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof SpeechTranscriberDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
