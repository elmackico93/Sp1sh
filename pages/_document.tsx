import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/themes/prism-tomorrow.min.css" />
          <meta name="application-name" content="Sp1sh" />
          <meta name="description" content="Find and use expert-curated shell scripts for Linux, Windows, and macOS. Emergency solutions, automation tools, and system administration scripts with verified security." />
          <meta name="keywords" content="shell scripts, PowerShell, bash, Linux scripts, Windows scripts, macOS scripts, system administration, emergency scripts, server management" />
          <meta name="theme-color" content="#0070e0" />
          
          {/* Open Graph / Social Media */}
          <meta property="og:title" content="Sp1sh | Ultimate Shell Script Repository" />
          <meta property="og:description" content="Professional shell scripts for Linux, Windows & macOS. Solve problems faster with verified scripts." />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://sp1sh.io" />
          <meta property="og:image" content="https://sp1sh.io/images/og-image.png" />
          
          {/* Preload critical fonts */}
          <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
          
          {/* Apple Touch Icon */}
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          
          {/* Favicon */}
          <link rel="icon" href="/favicon.ico" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          
          {/* Manifest */}
          <link rel="manifest" href="/site.webmanifest" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
