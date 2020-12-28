import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

interface FeatureProps {
  title: string;
  description: React.ReactNode;
  imageUrl?: string;
}

const features: FeatureProps[][] = [
  [
    {
      title: '📦 Zero-config packages',
      description: (
        <>
          No longer fiddle with Babel, Rollup, Webpack or other tooling configurations. Packemon
          configures packages automatically using sane and common defaults.
        </>
      ),
    },
    {
      title: '🧩 Multiple platforms',
      description: (
        <>
          Support either <em>or</em> both Node.js and Web based platforms on a per-project or
          per-package basis, with more platforms coming in the future.
        </>
      ),
    },
    {
      title: '🗂 Agnostic project structure',
      description: (
        <>
          Whether your project repository contains one package (solorepo) or many packages
          (monorepo), Packemon will handle any and all patterns.
        </>
      ),
    },
  ],
  [
    {
      title: '🌐 Stable environments',
      description: (
        <>
          Supported browser targets, React Native targets, and Node.js versions are carefully
          crafted to provide long term support and stability, with the ability to experiment.
        </>
      ),
    },
    {
      title: '⚡️ Runtime formats',
      description: (
        <>
          Want to support CommonJS (CJS)? ECMAScript (ESM)? What about Universal Module Definition
          (UMD)? Or maybe Node.js modules? Packemon supports all of them out of the box.
        </>
      ),
    },
    {
      title: '🚀 Distribution checks',
      description: (
        <>
          We provide safety checks to ensure your package's contain valid licenses, entry points,
          metadata, and much more!
        </>
      ),
    },
  ],
];

function Feature({ imageUrl, title, description }: FeatureProps) {
  const imgUrl = useBaseUrl(imageUrl);

  return (
    <div className={clsx('col col--4', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}

      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;

  return (
    <Layout title="Gotta pack 'em all!" description={siteConfig.tagline}>
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={clsx('button button--secondary button--lg', styles.getStarted)}
              to={useBaseUrl('docs/')}
            >
              Get started
            </Link>

            <iframe
              src="https://ghbtns.com/github-btn.html?user=milesj&repo=packemon&type=star&count=true&size=large"
              frameBorder="0"
              scrolling="0"
              title="GitHub"
            ></iframe>
          </div>
        </div>
      </header>

      <main>
        {features.map((items, i) => (
          <section key={i} className={styles.features}>
            <div className="container">
              <div className="row">
                {items.map((props, x) => (
                  <Feature key={x} {...props} />
                ))}
              </div>
            </div>
          </section>
        ))}
      </main>
    </Layout>
  );
}
