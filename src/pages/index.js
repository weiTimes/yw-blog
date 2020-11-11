import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features = [
  {
    title: '前端进阶',
    imageUrl: 'img/blog_1.jpg',
    description: (
      <>
        记录了前端学习过程中的笔记，主要包含Javascript深入、源码阅读、算法等专题。
      </>
    ),
  },
  {
    title: '博客',
    imageUrl: 'img/blog_2.jpg',
    description: (
      <>
        这里包含的范围较广，有某个技术点的深入与总结、平时的思考、效率工具、以及有趣有料的东西的记录。
      </>
    ),
  },
  {
    title: '博客搭建',
    imageUrl: 'img/blog_3.jpg',
    description: (
      <>
        使用Docusaurus搭建，它非常简单地帮助我搭建基于文档的博客网站；另外它是基于React的，这很合我的胃口。
      </>
    ),
  },
];

function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx('col col--4', styles.feature)}>
      {imgUrl && (
        <div className='text--center'>
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout
      title={`我的首页`}
      description='Description will go into a meta tag in <head />'>
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className='container'>
          <h1 className='hero__title'>{siteConfig.title}</h1>
          <p className='hero__subtitle'>{siteConfig.tagline}</p>
        </div>
      </header>
      <main className='main'>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className='container'>
              <div className='row'>
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <footer className={styles.footer}>
        <div className={styles.footerCenter}>
          Copyright © {new Date().getFullYear()} My Blog, Inc. Built with
          Docusaurus.
        </div>
      </footer>
    </Layout>
  );
}

export default Home;
