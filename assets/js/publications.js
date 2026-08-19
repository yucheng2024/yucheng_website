(() => {
    const openPublicationFromHash = () => {
        if (!window.location.hash.startsWith("#pub-")) return;

        const target = document.querySelector(window.location.hash);
        if (!(target instanceof HTMLDetailsElement)) return;

        document.querySelectorAll(".publication-group").forEach((group) => {
            group.open = group === target;
        });

        window.requestAnimationFrame(() => {
            target.scrollIntoView({ block: "start" });
        });
    };

    window.addEventListener("hashchange", openPublicationFromHash);
    openPublicationFromHash();
})();
