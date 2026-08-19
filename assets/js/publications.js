(() => {
    const openPublicationFromHash = () => {
        if (!window.location.hash.startsWith("#pub-")) return;

        const target = document.querySelector(window.location.hash);
        if (target instanceof HTMLDetailsElement) target.open = true;
    };

    window.addEventListener("hashchange", openPublicationFromHash);
    openPublicationFromHash();
})();
