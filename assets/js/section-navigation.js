(() => {
    const navigation = document.querySelector(".quick-links");
    if (!navigation) return;

    const navItems = [...navigation.querySelectorAll('a[href^="#"]')]
        .map((link) => ({
            link,
            target: document.getElementById(link.getAttribute("href").slice(1)),
        }))
        .filter(({ target }) => target);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const cleanAddress = () => {
        window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    };

    const preparePublicationGroup = (target) => {
        if (!(target instanceof HTMLDetailsElement) || !target.classList.contains("publication-group")) return;

        document.querySelectorAll(".publication-group").forEach((group) => {
            group.open = group === target;
        });
    };

    const jumpTo = (target) => {
        preparePublicationGroup(target);
        target.scrollIntoView({
            behavior: prefersReducedMotion.matches ? "auto" : "smooth",
            block: "start",
        });
        cleanAddress();
    };

    document.querySelectorAll('.quick-links a[href^="#"]').forEach((link) => {
        const target = document.getElementById(link.getAttribute("href").slice(1));
        if (!target) return;

        link.addEventListener("click", (event) => {
            event.preventDefault();
            jumpTo(target);
        });
    });

    const initialHash = window.location.hash;
    if (initialHash && !initialHash.startsWith("#pub-")) {
        const initialTarget = document.getElementById(initialHash.slice(1));
        if (initialTarget && navItems.some(({ target }) => target === initialTarget)) {
            window.requestAnimationFrame(() => {
                initialTarget.scrollIntoView({ block: "start" });
                cleanAddress();
            });
        }
    }

    let scheduled = false;
    const updateCurrentSection = () => {
        scheduled = false;
        const marker = Math.min(window.innerHeight * 0.32, 220);
        let current = null;

        navItems.forEach((item) => {
            if (item.target.getBoundingClientRect().top <= marker) current = item;
        });

        navItems.forEach(({ link }) => {
            if (current?.link === link) {
                link.setAttribute("aria-current", "true");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    };

    const scheduleUpdate = () => {
        if (scheduled) return;
        scheduled = true;
        window.requestAnimationFrame(updateCurrentSection);
    };

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    updateCurrentSection();
})();
