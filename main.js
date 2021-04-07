import { $ } from '@sciter';

monitor_screen_area(0, 0, 200, 200, 500, function () {
  $('[role=window-caption]').textContent = 'Change detected!';
});

Window.this.on('statechange', () => Window.this.isTopmost = true);

centerWindow();

function centerWindow() {
  const [w, h] = [200, 220];
  const [sw, sh] = Window.this.screenBox('frame', 'dimension');
  Window.this.move((sw - w) / 2, (sh - h) / 2, w, h, false);
}

$('.about').on('click', function () {
  Window.this.modal(
    <info caption="About">
      This application uses <a href="https://sciter.com">Sciter</a> Engine,
    © <a href="https://terrainformatica.com">Terra Informatica</a> Software, Inc.
  </info>
  );
});

$('.close').on('click', () => Window.this.close());

function screenshot(x, y, width, height) {
  const box = Window.this.box('position', 'client', 'screen');
  console.log(...box);
  const [sx, _sy] = box;
  const sy = _sy + 20;
  const image = Window.this.screenBox('snapshot');
  $('.snapshot').paintBackground = function (gfx) {
    gfx.draw(image, {
      x: 0,
      y: 0,
      width,
      height,
      srcX: sx,
      srcY: sy,
      srcWidth: width,
      srcHeight: height
    });
  };
  $('.snapshot').requestPaint();
  const div_screenshot = new Graphics.Image(width, height, $('.snapshot'));
  return div_screenshot;
}

async function monitor_screen_area(x, y, width, height, milliseconds, callback) {
  while (true) {
    let bytes_1 = screenshot(x, y, width, height).toBytes('bgra');
    await new Promise((resolve) => setTimeout(resolve, milliseconds));
    $('[role=window-caption]').textContent = 'Monitoring for changes ...';
    const bytes_2 = screenshot(x, y, width, height).toBytes('bgra');

    const array_1 = new Uint8Array(bytes_1);
    const array_2 = new Uint8Array(bytes_2);

    for (let i = 0; i < array_1.length; i++) {
      if (array_1[i] !== array_2[i]) {
        callback();
        break;
      }
    }
  }

}


