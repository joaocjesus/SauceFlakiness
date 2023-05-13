import '@testing-library/jest-dom';
import ResizeObserver from 'resize-observer-polyfill';
import "./log";

const canvas = require('canvas');

const { createCanvas, createImageData, Image } = canvas;
Object.assign(window, {
  createCanvas,
  createImageData,
  Image,
  ResizeObserver
});

// include Logger in tests
Object.assign(window, {
  Logger
});
