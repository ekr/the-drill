const nNoise = .2;       // Duplicated from index.js

function topOfRow(i, nodeGap) {
    return nodeGap * i - (.5 + nNoise) / 2;
}

function bottomOfRow(i, nodeGap) {
    return nodeGap * i + (.5 + nNoise) / 2;
}

function Slice(idx, w, nodeCt, nodeGap, sections, above) {
    let _top = topOfRow(idx, nodeGap);
    let _bottom = bottomOfRow(idx + nodeCt+1, nodeGap);
    let _canvas = new OffscreenCanvas(w, _bottom - _top);
    let _ctx = _canvas.getContext('2d');

    // Copy any overlapping pixels.
    if (above) {
        const overlap = above.bottom() - _top;
        _ctx.drawImage(above.canvas(), 0,
            above.height() - overlap,
            above.width(), overlap,
            0, 0,
            above.width(), overlap);
    }

    // Draw ourselves.
    _ctx.clearRect(0, 0, _canvas.width, _canvas.height);

    const topNode = idx;
    const botNode = idx + nodeCt;

    for (let j = topNode; j <= botNode; j++) {
        const row = sections[j]
        row.forEach(section => {
            //console.log(section)
            const path = section.path

            _ctx.beginPath();
            _ctx.moveTo(path[0][0] * nodeGap, path[0][1] * nodeGap - _top);


            for (let i = 1; i < path.length; i += 1) {
                const x = path[i][0] * nodeGap;
                const y = path[i][1] * nodeGap - _top;
                _ctx.lineTo(x, y);
            }

            _ctx.fillStyle = section.color;
            _ctx.fill();
        });
    }

    function index() { return idx; }
    function top() { return _top; }
    function bottom() { return _bottom; }
    function height() { return _bottom - _top; }
    function width() { return w; }
    function canvas() { return _canvas; }

    return {
        index,
        top,
        bottom,
        height,
        width,
        canvas
    }
}

export { Slice };
