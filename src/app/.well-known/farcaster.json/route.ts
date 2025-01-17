import { PROJECT_TITLE } from "~/lib/constants";

export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_URL || `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;

  const config = {
    accountAssociation: {
      header: "eyJmaWQiOiA4ODcyNDYsICJ0eXBlIjogImN1c3RvZHkiLCAia2V5IjogIjB4N0Q0MDBGRDFGNTkyYkI0RkNkNmEzNjNCZkQyMDBBNDNEMTY3MDRlNyJ9",
      payload: "eyJkb21haW4iOiAic3RlcGhhbmNpbGwtc2t5dmlzdGEudmVyY2VsLmFwcCJ9",
      signature: "MHgxZGMyYzljMTM3ZTcwNzg3ZjZmNTY1MmZhYmRmN2RhNzY1NDdlZmM2MDE3MzE0OTFmODQ4ODVhM2JkM2JjMDMyNmEzZjNkZmFjOTRkMTQzNGYxYzg3ZDIxZDVjNzYxNmU0NDU0MzA0ZjkwYzViNTE1YTA3YzFiYjlhMmZhYWU4YzFi"
    },
    frame: {
      version: "1",
      name: PROJECT_TITLE,
      iconUrl: `${appUrl}/icon.png`,
      homeUrl: appUrl,
      imageUrl: `${appUrl}/frames/hello/opengraph-image`,
      buttonTitle: "Launch Frame",
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: "#f7f7f7",
      webhookUrl: `${appUrl}/api/webhook`,
    },
  };

  return Response.json(config);
}
