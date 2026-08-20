(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    root.classList.add("motion-ready");

    const revealTargets = [
        ...document.querySelectorAll(".page__content > section"),
    ];

    revealTargets.forEach((target) => target.classList.add("reveal-section"));

    if (reducedMotion.matches || !("IntersectionObserver" in window)) {
        revealTargets.forEach((target) => target.classList.add("is-visible"));
        root.classList.add("motion-loaded");
    } else {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        }, {
            rootMargin: "0px 0px -10% 0px",
            threshold: 0.08,
        });

        revealTargets.forEach((target) => revealObserver.observe(target));

        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => root.classList.add("motion-loaded"));
        });
    }

    const getDirectContent = (details) => [...details.children]
        .find((child) => child.tagName !== "SUMMARY");

    const animateDetails = (details) => {
        const summary = details.querySelector(":scope > summary");
        const content = getDirectContent(details);
        if (!summary || !content || typeof details.animate !== "function" || typeof content.animate !== "function") return;

        summary.addEventListener("click", (event) => {
            if (reducedMotion.matches || details.dataset.motionAnimating === "true") return;

            event.preventDefault();
            details.dataset.motionAnimating = "true";
            const isOpening = !details.open;

            if (isOpening) details.open = true;

            const startHeight = isOpening ? summary.offsetHeight : details.offsetHeight;
            const endHeight = isOpening ? details.scrollHeight : summary.offsetHeight;

            details.style.overflow = "hidden";
            const heightAnimation = details.animate([
                { height: `${startHeight}px` },
                { height: `${endHeight}px` },
            ], {
                duration: isOpening ? 280 : 230,
                easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            });

            content.animate([
                { opacity: isOpening ? 0 : 1, transform: isOpening ? "translateY(-5px)" : "translateY(0)" },
                { opacity: isOpening ? 1 : 0, transform: isOpening ? "translateY(0)" : "translateY(-4px)" },
            ], {
                duration: isOpening ? 240 : 170,
                easing: "ease-out",
                fill: "both",
            });

            heightAnimation.finished
                .then(() => {
                    if (!isOpening) details.open = false;
                })
                .catch(() => {})
                .finally(() => {
                    details.style.removeProperty("height");
                    details.style.removeProperty("overflow");
                    content.getAnimations().forEach((animation) => animation.cancel());
                    delete details.dataset.motionAnimating;
                });
        });
    };

    document.querySelectorAll(".publication-group, .service-group, .news-year")
        .forEach(animateDetails);
})();
