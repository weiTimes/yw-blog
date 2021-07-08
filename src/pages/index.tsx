import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import axios from 'axios';

import styles from './styles.module.css';

import AVATAR from '../../static/img/avatar_employee.png';

interface IWords {
  content: string;
  author: string;
}

const features = [
  {
    title: '前端进阶',
    imageUrl: 'img/icon_front.svg',
    description: (
      <>
        记录了前端学习过程中的笔记，主要包含Javascript深入、源码阅读、算法等专题。
      </>
    ),
  },
  {
    title: '博客',
    imageUrl: 'img/icon_blog.svg',
    description: (
      <>
        这里包含的范围较广，有某个技术点的深入与总结、平时的思考、效率工具、以及有趣有料的东西的记录。
      </>
    ),
  },
  {
    title: '博客搭建',
    imageUrl: 'img/icon_site.svg',
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
        <div className='text--center' style={{ marginBottom: '20px' }}>
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
  const [words, setWords] = useState<IWords>();

  useEffect(() => {
    axios
      .post<{ data: IWords }>('https://v2.alapi.cn/api/mingyan', {
        token: 'VqtrpyFW4qBlrxB7',
      })
      .then((res) => {
        setWords(res.data.data);
      });
  }, []);

  return (
    <Layout
      title={`我的首页`}
      description='Description will go into a meta tag in <head />'>
      <div className={styles.content}>
        <header className={clsx('hero hero--primary', styles.heroBanner)}>
          <div className='container'>
            <h1 className='hero__title'>
              <div className='row' style={{ alignItems: 'center' }}>
                <img className={styles.avatar} src={AVATAR} />
                <span>Hi, 我是叶威</span>
              </div>
              <span className={styles.subTitle}>
                一个前端攻城狮 - In HangZhou
              </span>
            </h1>
            <p className='hero__subtitle'>{siteConfig.tagline}</p>
          </div>
        </header>

        <section className={styles.wordsSection}>
          <div className={styles.wordsWrap}>
            <div className={styles.words}>
              {words?.content}{' '}
              {words && (
                <span className={styles.author}>- {words?.author}</span>
              )}
            </div>
          </div>
        </section>

        <main>
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
      </div>
      <footer className={styles.footer}>
        <div className={styles.footerCenter}>
          Copyright © 浙ICP备2020032898号-1. Built with Docusaurus.
        </div>
      </footer>
    </Layout>
  );
}

export default Home;
