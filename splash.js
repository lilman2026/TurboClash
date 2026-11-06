(function () {
    var el = document.getElementById('playvoraSplash');
    if (!el)
        return;
    document.documentElement.classList.add('pv-splash-active');
    document.body.classList.add('pv-splash-active');
    var inner = el.querySelector('.nsInner');
    var splashNoise = document.getElementById('kwSplashNoise');
    var finished = false;
    var retried = false;
    var fadeRaf = 0;
    function playSplashNoise() {
        if (!splashNoise || finished)
            return;
        try {
            splashNoise.currentTime = 0;
            splashNoise.volume = 1;
            var p = splashNoise.play();
            if (p && typeof p.catch === 'function')
                p.catch(function () { });
        }
        catch (_) { }
    }
    function retrySplashNoise() {
        if (retried || finished)
            return;
        retried = true;
        if (splashNoise && splashNoise.paused)
            playSplashNoise();
    }
    function fadeSplashNoise() {
        if (!splashNoise || finished)
            return;
        var fadeStart = performance.now();
        var startVolume = Math.max(0, Math.min(1, splashNoise.volume));
        cancelAnimationFrame(fadeRaf);
        function step(now) {
            if (finished || !splashNoise)
                return;
            var t = Math.min(1, (now - fadeStart) / 3000);
            splashNoise.volume = startVolume * (1 - t);
            if (t < 1) {
                fadeRaf = requestAnimationFrame(step);
            }
            else {
                try {
                    splashNoise.pause();
                }
                catch (_) { }
            }
        }
        fadeRaf = requestAnimationFrame(step);
    }
    function finishSplash() {
        if (finished)
            return;
        finished = true;
        cancelAnimationFrame(fadeRaf);
        if (splashNoise) {
            try {
                splashNoise.volume = 0;
                splashNoise.pause();
            }
            catch (_) { }
        }
        try {
            el.style.pointerEvents = 'none';
            el.style.visibility = 'hidden';
        }
        catch (_) { }
        el.remove();
        document.documentElement.classList.remove('pv-splash-active');
        document.body.classList.remove('pv-splash-active');
    }
    playSplashNoise();
    setTimeout(fadeSplashNoise, 6000);
    window.addEventListener('pointerdown', retrySplashNoise, { once: true, passive: true });
    window.addEventListener('keydown', retrySplashNoise, { once: true });
    if (inner) {
        inner.addEventListener('animationend', function (e) {
            if (e.animationName === 'bwzSplashSequence')
                finishSplash();
        }, { once: true });
    }
    setTimeout(finishSplash, 9500);
})();
