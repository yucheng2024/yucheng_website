(() => {
    const mobileQuery = window.matchMedia("(max-width: 640px)");
    let currentMode = null;

    const setResponsiveDetails = () => {
        const mode = mobileQuery.matches ? "mobile" : "desktop";
        if (mode === currentMode) return;
        currentMode = mode;

        const newsYears = [...document.querySelectorAll(".news-year")];
        const publicationGroups = [...document.querySelectorAll(".publication-group")];
        const serviceGroups = [...document.querySelectorAll(".service-group")];

        if (mode === "mobile") {
            newsYears.forEach((group, index) => {
                group.open = index === 0;
            });
            publicationGroups.forEach((group) => {
                group.open = false;
            });
            serviceGroups.forEach((group) => {
                group.open = false;
            });
            return;
        }

        newsYears.forEach((group) => {
            group.open = true;
        });

        if (!window.location.hash.startsWith("#pub-")) {
            publicationGroups.forEach((group, index) => {
                group.open = index === 0;
            });
        }

        serviceGroups.forEach((group, index) => {
            group.open = index === 0;
        });
    };

    mobileQuery.addEventListener?.("change", setResponsiveDetails);
    setResponsiveDetails();
})();
