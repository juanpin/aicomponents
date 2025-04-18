import type {Meta, StoryObj} from '@storybook/react';

import {WaveVisualizer} from './WaveVisualizer';

const meta = {
    title: 'Example/WaveVisualizer',
    component: WaveVisualizer,
    parameters: {
        // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
        layout: 'fullscreen',
    },
} as Meta<typeof WaveVisualizer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    render: args => {
        return <WaveVisualizer {...args} />;
    },
    args: {},
};

export const WithCode: Story = {
    render: args => {
        // here comes the code
        return <WaveVisualizer {...args} />;
    },
};

WithCode.args = {};

WithCode.argTypes = {};

WithCode.parameters = {
    docs: {
        source: {
            language: 'tsx',
            type: 'code',
        },
    },
};
