const sharp = require("sharp");
const path = require("node:path");

const publicDir = path.join(process.cwd(), "public");

// Cria um SVG base: fundo escuro, letra B dourada
const tamanhos = [192, 512, 512];
const nomes = ["icon-192.png", "icon-512.png", "apple-touch-icon.png"];

async function gerar(svg, nome) {
  const buffer = Buffer.from(svg);
  await sharp(buffer).png().toFile(path.join(publicDir, nome));
  console.log("criado:", nome);
}

(async () => {
  for (const [i, size] of tamanhos.entries()) {
    const svg = `
      <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#0f0f0f"/>
        <circle cx="50%" cy="50%" r="${size * 0.34}" fill="#e0b84f"/>
        <text x="50%" y="54%" font-family="Arial, sans-serif" font-size="${size * 0.42}"
              font-weight="bold" fill="#0f0f0f" text-anchor="middle" dominant-baseline="middle">
          B
        </text>
      </svg>`;
    await gerar(svg, nomes[i]);
  }
  console.log("Ícones gerados com sucesso!");
})();