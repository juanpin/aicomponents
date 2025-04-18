import type {Meta, StoryObj} from '@storybook/react';

import {WaveVisualizerDemo} from './WaveVisualizerDemo';

const meta: Meta<typeof WaveVisualizerDemo> = {
    title: 'Components/WaveVisualizerDemo',
    component: WaveVisualizerDemo,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof WaveVisualizerDemo>;

export const Default: Story = {
    args: {},
};
