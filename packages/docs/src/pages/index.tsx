import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import styles from './index.module.css';
import GithubStarsButton from '../components/HomepageFeatures/buttons/GithubStars';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();


  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className={`hero__title ${styles.title}`}>{siteConfig.title}</h1>
        <p className={`hero__subtitle ${styles.heroSubtitle}`}>{siteConfig.tagline}</p>


        <div className={styles.buttons}>
          <Link
            className={clsx("button button--secondary button--lg", styles.getStartedButton)}
            to="/docs/introduction/getting-started">
            Get Started
          </Link>
          <GithubStarsButton user='nearform' repo="lyra" size="large" />
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
