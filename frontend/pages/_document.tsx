import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Google Maps JS API with Places */}
          {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && (
            <script
              src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&v=weekly&region=AU`}
              async
              defer
            />
          )}

          {/* Extended Google Web Component Loader */}
          <script
              async
              defer
              src="https://www.gstatic.com/maps/extended-component-library/loader.js"
            ></script>

        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
