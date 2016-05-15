# image-diff-view
Compares images, inspired by Github's [image diff view modes](https://github.com/blog/817-behold-image-view-modes).

Inspered by https://github.com/cezary/react-image-diff also ([Demo](http://cezary.github.io/react-image-diff/)).

![Gif image diff view demo](https://github.com/cezary/react-image-diff/blob/master/public/img/demo-swipe.gif)

## Modes
* `difference` (classic diff)
* `fade` (onion skin)
* `swipe`

## Usage
Controls are not delivery out of the box.
You are free to implement your unique diff controls.

```js
import ImageDiff from 'image-diff-view';

var beforeUrl = 'http://cezary.github.io/react-image-diff/public/img/spot-the-difference-a.jpg',
    afterUrl = 'http://cezary.github.io/react-image-diff/public/img/spot-the-difference-b.jpg';

var imageDiff = new ImageDiff(document.getElementById('image-diff'), beforeUrl, afterUrl, 'swipe');
imageDiff.swipe(0.5);
imageDiff.update(beforeUrl, afterUrl, 'fade');
imageDiff.fade(0.8);
```

## Dependencies
No dependencies required

## Our users
* Yandex
