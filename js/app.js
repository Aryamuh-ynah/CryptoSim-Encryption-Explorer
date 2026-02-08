import { getRoute, onRouteChange } from "./router.js";

import { updateActiveNav } from "./navActive.js";
import { initThemeToggle } from "./theme.js";
import { renderAffine } from "./views/affineView.js";
import { renderAtbash } from "./views/atbashView.js";
import { renderCaesarAttack } from "./views/caesarAttackView.js";
import { renderCaesar } from "./views/caesarView.js";
import { renderCompare } from "./views/compareView.js";
import { renderFrequency } from "./views/frequencyView.js";
import { renderHome } from "./views/home.js";
import { renderPlayfair } from "./views/playfairView.js";
import { renderRailFence } from "./views/railFenceView.js";
import { renderTransposition } from "./views/transpositionView.js";
import { renderVigenere } from "./views/vigenereView.js";





const app = document.getElementById("app");

function render() {
    updateActiveNav();
  const route = getRoute();

    switch (route) {
    case "home":
        renderHome(app);
        break;
    case "caesar":
        renderCaesar(app);
        break;
    case "vigenere":
        renderVigenere(app);
        break;
    case "atbash":
        renderAtbash(app);
        break;
    case "railfence":
        renderRailFence(app);
        break;
    case "affine":
        renderAffine(app);
        break;
    case "transposition":
        renderTransposition(app);
        break;
    case "playfair":
        renderPlayfair(app);
        break;
    case "frequency":
        renderFrequency(app);
        break;
    case "compare":
        renderCompare(app);
        break;
    case "attack-caesar":
        renderCaesarAttack(app);
        break;
    default:
        renderHome(app);
    }

}


initThemeToggle();

onRouteChange(render);
render();
