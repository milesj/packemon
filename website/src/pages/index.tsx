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
      title: '💻 Cross-platform',
      description: (
        <>
          Whether on MacOS, Windows, or Linux, take confidence in your code running on any and all
          platforms.
        </>
      ),
    },
    {
      title: '🔬 Type-safe',
      description: (
        <>
          With the power of{' '}
          <a href="https://www.typescriptlang.org/" target="_blank">
            TypeScript
          </a>
          , we provide a strict, type-safe, and ergonomic API for a better developer experience.
        </>
      ),
    },
    {
      title: '🔀 Async-first',
      description: (
        <>
          Engineered all APIs and abstractions to be async-first for maximum performance,
          efficiency, and portability.
        </>
      ),
    },
  ],
  [
    {
      title: '📦 Low dependency',
      description: (
        <>
          In an effort to reduce lock file churn, large dependency graphs, and unexpected
          vulnerabilities, we only include a dependency when absolutely necessary.
        </>
      ),
    },
    {
      title: '⚙️ Convention & configuration',
      description: (
        <>
          Designed to offer the perfect blend of convention (we provide consistency) and
          configuration (you customize for each integration) based patterns.
        </>
      ),
    },
    {
      title: '🚀 Environment agnostic',
      description: (
        <>
          Utilize Boost in both server-side and client-side environments -- web applications,
          command line programs, developer tooling, packages, and more.
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
    <Layout title="Cross-platform tooling" description={siteConfig.tagline}>
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
              src="https://ghbtns.com/github-btn.html?user=milesj&repo=boost&type=star&count=true&size=large"
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
