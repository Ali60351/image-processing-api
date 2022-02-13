import sharp from 'sharp';

export interface ResizeOptions extends sharp.ResizeOptions {
    width: number;
    height: number;
}

export interface ResizeQueryParams {
    filename: string;
    width: number | null;
    height: number | null;
    extension: string | undefined;
}
