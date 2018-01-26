import commonjs from 'rollup-plugin-commonjs';
import resolver from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import pkg from './package.json';

export default {
  name: 'f-react',
  input: './src/index.js',
  external: [
    'react',
    'react-dom',
    'prop-types'
  ],
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    resolver({
      jsnext: true,
      main: true,
      browser: true,
    }),
    commonjs({
      include: 'node_modules/**',
    }),
  ],
  output: [
    {
      file: pkg.browser,
      format: 'umd',
    },
    {
      file: pkg.main,
      format: 'cjs',
    },
    {
      file: pkg.module,
      format: 'es',
    },
  ],
};