# Image Processing API

## Installation

- Install the dependancies with `npm i`. (Tested on node v13.14.0)

## Scripts

| Name             | Function                                                 |
| ---------------- | -------------------------------------------------------- |
| `npm run start`  | Run the express server on `localhost:3000`               |
| `npm run test`   | Compile the TS project and run jasmine on compiled files |
| `npm run eslint` | Check the TS project for any ESLint errors               |
| `npm run lint`   | Fix any prettier issues present in TS project            |

## Endpoint

The image processing API is available on the endpoint `/api/image`

## Query Params

| Name     | Property       | Details                                                                                                                                  |
| -------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| filename | Image Filename | Used to pick image from the `images` folder. Example usage: `fjord.jpg`. If passed without any other params, will return original image. |
| w        | Width          | Controls the width of the resized image. Requires `h` query param to be available too. Example usage `1920`                              |
| h        | Height         | Controls the height of the resized image. Requires `w` query param to be available too. Example usage `1080`                             |
| ext      | Extension      | Controls the file type of the resized image. Requires both `h` and `w` to be present too. Valid values are `png`, `jpg` and `jpeg`       |

## Environment Variables

| Name     | Function                                         |
| -------- | ------------------------------------------------ |
| NODE_ENV | If set to `test`, disable the logging of server. |

## Example Usages

| Usecase                                            | URL                                                                                |
| -------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Get original image for `976013.jpeg`               | [LINK](http://localhost:3000/api/image?filename=976013.jpeg)                       |
| Get `976013.jpeg` in 1920x1080 size                | [LINK](http://localhost:3000/api/image?filename=976013.jpeg&w=1920&h=1080)         |
| Get `976013.jpeg` in 1920x1080 size and png format | [LINK](http://localhost:3000/api/image?filename=976013.jpeg&w=1920&h=1080&ext=png) |
