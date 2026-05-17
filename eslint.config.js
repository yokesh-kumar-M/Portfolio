import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

// React Three Fiber relies on intrinsic elements (mesh, points, etc.) and
// passes Three.js-specific props that ESLint's react/no-unknown-property
// rule does not know about by default.
const r3fProps = [
  'args',
  'attach',
  'array',
  'count',
  'itemSize',
  'position',
  'rotation',
  'scale',
  'intensity',
  'fov',
  'far',
  'near',
  'castShadow',
  'receiveShadow',
  'transparent',
  'opacity',
  'depthWrite',
  'depthTest',
  'blending',
  'wireframe',
  'roughness',
  'metalness',
  'emissive',
  'emissiveIntensity',
  'sizeAttenuation',
  'vertexShader',
  'fragmentShader',
  'uniforms',
  'makeDefault',
  'eskil',
  'offset',
  'darkness',
  'luminanceThreshold',
  'mipmapBlur',
  'radius',
  'dpr',
  'gl',
  'shadow-mapSize',
  'object',
  'map',
  'toneMapped',
  'side',
  'distance',
  'preset',
  'decay',
]

export default defineConfig([
  globalIgnores(['dist', '.next']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      react.configs.flat.recommended,
      react.configs.flat['jsx-runtime'],
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    settings: {
      react: { version: 'detect' },
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', {
        varsIgnorePattern: '^[A-Z_]|^motion$',
        argsIgnorePattern: '^_|^[A-Z]',
      }],
      'react/no-unknown-property': ['error', { ignore: r3fProps }],
      'react/prop-types': 'error',
      'react/jsx-no-duplicate-props': 'error',
      'react/no-array-index-key': 'warn',
    },
  },
])
