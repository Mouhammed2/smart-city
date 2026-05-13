import { useMemo } from "react";
import { useThree } from "@react-three/fiber";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
  Noise,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";

interface PostProcessingEffectsProps {
  scrollProgress?: number;
}

export function PostProcessingEffects({
  scrollProgress = 0,
}: PostProcessingEffectsProps) {
  const { viewport } = useThree();

  // Calculate dynamic intensity based on scroll
  const bloomIntensity = useMemo(() => {
    // Bloom increases as user scrolls, peaking in the middle
    const scrollFactor = 1 - Math.abs(scrollProgress - 0.5) * 2;
    return 0.8 + scrollFactor * 0.4;
  }, [scrollProgress]);

  const chromaticOffset = useMemo(() => {
    // Subtle chromatic aberration that increases slightly with scroll
    const baseOffset = 0.003;
    const scrollOffset = scrollProgress * 0.002;
    return new THREE.Vector2(baseOffset + scrollOffset, baseOffset * 0.5);
  }, [scrollProgress]);

  return (
    <EffectComposer>
      {/* Bloom - makes cyan nodes glow like neon signs */}
      <Bloom
        blendFunction={BlendFunction.ADD}
        intensity={bloomIntensity}
        width={300}
        height={300}
        kernelSize={5}
        luminanceThreshold={0.9}
        luminanceSmoothing={0.025}
        mipmapBlur
      />

      {/* Chromatic Aberration - subtle RGB split on edges */}
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={chromaticOffset}
        radialModulation={false}
        modulationOffset={0}
      />

      {/* Vignette - darkens corners, focuses attention center */}
      <Vignette
        blendFunction={BlendFunction.NORMAL}
        eskil={false}
        offset={0.35}
        darkness={0.4}
      />

      {/* Noise - adds film grain directly to 3D render */}
      <Noise blendFunction={BlendFunction.OVERLAY} premultiply opacity={0.08} />
    </EffectComposer>
  );
}
