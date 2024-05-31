import {SkiaCanvas} from '@remotion/skia';
import {
	BlurMask,
	Extrapolate,
	Group,
	interpolate,
	Path,
	RadialGradient,
	Rect,
	Skia,
	vec,
} from '@shopify/react-native-skia';
import {useMemo} from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {finalAngle, initialAngle, MAX_DISTANCE_FROM_CENTER} from './constants';

// Function to calculate the position on a logarithmic spiral
const logSpiral = ({angle, index}: {angle: number; index: number}) => {
	// Calculate the radial distance from the center based on the index
	const a = (index / 4) * 2;
	// Define a constant factor for the exponential growth of the spiral
	const k = 0.005;

	// Return the coordinates (x, y) on the spiral
	return {
		x: a * Math.exp(k * angle) * Math.cos(angle * index), // Calculate the x position
		y: a * Math.exp(k * angle) * Math.sin(angle * index), // Calculate the y position
	};
};

export const Animation = () => {
	const {width, height, durationInFrames} = useVideoConfig();

	const frame = useCurrentFrame();

	// Value between 0 and 1
	const progress = frame / durationInFrames;

	const path = useMemo(() => {
		// Create a new Path object to store the circles
		const circles = Skia.Path.Make();

		// Loop to create 3000 circles
		for (let index = 0; index < 3000; index++) {
			// Calculate initial position on the log spiral based on initial angle and index
			const {x: initialX, y: initialY} = logSpiral({
				angle: initialAngle,
				index,
			});

			// Calculate final position on the log spiral based on final angle and index
			const {x: finalX, y: finalY} = logSpiral({
				angle: finalAngle,
				index,
			});

			// Interpolate the x position based on the progress
			const x = interpolate(
				progress,
				[0, 1],
				[initialX, finalX],
				Extrapolate.CLAMP,
			);

			// Interpolate the y position based on the progress
			const y = interpolate(
				progress,
				[0, 1],
				[initialY, finalY],
				Extrapolate.CLAMP,
			);

			// Calculate the distance from the center (0, 0) to the interpolated position
			const distanceFromCenter = Math.sqrt(x ** 2 + y ** 2);

			// Interpolate the radius of the circle based on the distance from the center
			const radius = interpolate(
				distanceFromCenter,
				[0, MAX_DISTANCE_FROM_CENTER],
				[1, 0.5],
				Extrapolate.CLAMP,
			);

			// Add a circle to the Path object at the interpolated position with the interpolated radius
			circles.addCircle(x, y, radius);
		}

		// Return the Path object containing all the circles
		return circles;
	}, [progress]);

	const transform = useMemo(() => {
		return [
			{
				translateX: width / 2,
			},
			{
				translateY: height / 2,
			},
		];
	}, [height, width]);

	return (
		<SkiaCanvas height={height} width={width}>
			<Rect width={width} height={height} x={0} y={0} color="black" />
			<Group transform={transform}>
				<Path path={path} />
				<RadialGradient
					c={vec(0, 0)}
					r={500}
					colors={['white', 'rgb(0, 188, 246)', 'rgb(28, 137, 255)']}
				/>
			</Group>
			<BlurMask blur={10} style="solid" />
		</SkiaCanvas>
	);
};
