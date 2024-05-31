import {SkiaCanvas} from '@remotion/skia';

import {useVideoConfig} from 'remotion';

export const Spiral: React.FC = () => {
	const {height, width} = useVideoConfig();

	return (
		<SkiaCanvas height={height} width={width}>
			<></>
		</SkiaCanvas>
	);
};
