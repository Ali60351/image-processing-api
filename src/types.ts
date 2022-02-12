import sharp from 'sharp';

export interface ResizeOptions extends sharp.ResizeOptions {
    width: number;
    height: number;
};
