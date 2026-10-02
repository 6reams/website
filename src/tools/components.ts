/**
 * Maps a registry `component` key to its Astro component.
 * Add your new tool here after creating its .astro file.
 */
import HashGenerator from './HashGenerator.astro';
import Encoder from './Encoder.astro';
import JwtDecoder from './JwtDecoder.astro';
import PasswordTool from './PasswordTool.astro';
import CidrCalculator from './CidrCalculator.astro';
import RegexTester from './RegexTester.astro';

export const toolComponents = {
  HashGenerator,
  Encoder,
  JwtDecoder,
  PasswordTool,
  CidrCalculator,
  RegexTester,
} as const;

export type ToolComponentKey = keyof typeof toolComponents;
