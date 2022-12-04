// Import Bun
import * as Bun from 'bun';
import * as fs from 'fs';

function callExecutable(args: string[]) {
  const output = Bun.spawnSync(['Rhodopsin', "--cli", ...args]);
  return output.stdout.toString()
}

function parseImage(
  imagePath: string,
  lineHeight?: number,
  languages?: string[],
) {
  const args = ["cover", "--json"];

  if (lineHeight) {
    args.push("--line-height", lineHeight.toString());
  }

  if (languages) {
    args.push("--languages", languages.join(","));
  }
  args.push(imagePath);
  return callExecutable(args);
}

async function handleRequest(req: Request): Promise<Response> {
  const reqJson: any = await req.json();
  
  const image = reqJson.image;
  const imageBuffer = Buffer.from(image, "base64");
  const imagePath = `./tmp/${reqJson.name}`; 

  await Bun.write(imagePath, imageBuffer);

  const parsed = parseImage(imagePath, reqJson.lineHeight, reqJson.languages);
  console.log(parsed);
  fs.unlinkSync(imagePath);
  
  return new Response(parsed);
}

Bun.serve({
  port: 5423,
  fetch: handleRequest,
});
