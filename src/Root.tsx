import {Composition} from 'remotion';

import {Animation} from './Animation';

const DURATION_SECONDS = 5;
const FPS = 60;

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="Spiral"
				component={Animation}
				durationInFrames={DURATION_SECONDS * FPS}
				fps={FPS}
				width={1920}
				height={1080}
			/>
		</>
	);
};
