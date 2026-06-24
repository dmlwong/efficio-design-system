'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@efficio/orbit';
import {
  getSafeDesignSystemNextPath,
  readDesignSystemSession,
  writeDesignSystemSession,
} from '../auth';
import { DitheringShader } from './DitheringShader';
import type { DesignSystemSession } from '../auth';

function readNextPath() {
  if (typeof window === 'undefined') return '/design-system';

  const params = new URLSearchParams(window.location.search);
  return getSafeDesignSystemNextPath(params.get('next'));
}

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (readDesignSystemSession()) {
      router.replace(readNextPath());
    }
  }, [router]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedName = name.trim();
    if (!normalizedName) {
      setError('Enter your name to continue.');
      return;
    }

    const session: DesignSystemSession = {
      name: normalizedName,
      signedInAt: new Date().toISOString(),
    };

    writeDesignSystemSession(session);
    router.replace(readNextPath());
  };

  return (
    <main
      className="ds-login-screen"
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: 'var(--orbit-space-l)',
        background: 'var(--orbit-color-bg-canvas)',
        color: 'var(--orbit-color-text-primary)',
        fontFamily: 'var(--orbit-font-family-sans)',
        boxSizing: 'border-box',
      }}
    >
      <style>{`
        .ds-login-background {
          position: absolute;
          inset: var(--orbit-space-none);
          overflow: hidden;
          pointer-events: none;
        }

        .ds-login-panel {
          position: relative;
          z-index: var(--orbit-z-sticky);
          width: min(100%, calc(var(--orbit-space-mega) * 6));
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--orbit-space-base);
          padding: var(--orbit-space-base);
          border: var(--orbit-space-px) solid var(--orbit-color-border-default);
          border-radius: var(--orbit-radius-lg);
          background: var(--orbit-color-bg-default);
          box-shadow: var(--orbit-shadow-md);
          box-sizing: border-box;
        }

        .ds-login-brand {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--orbit-space-base);
          min-width: var(--orbit-space-none);
          text-align: center;
        }

        .ds-login-mark {
          display: flex;
          align-items: center;
          justify-content: center;
          width: var(--orbit-space-l);
          height: var(--orbit-space-l);
          border-radius: var(--orbit-radius-md);
          background: var(--orbit-color-btn-primary-bg);
          color: var(--orbit-color-text-inverse);
          font-size: var(--orbit-text-sm);
          font-weight: var(--orbit-font-weight-bold);
          line-height: var(--orbit-leading-tight);
          box-shadow: var(--orbit-shadow-sm);
        }

        .ds-login-brand-text {
          min-width: var(--orbit-space-none);
        }

        .ds-login-title {
          margin: var(--orbit-space-xxs) var(--orbit-space-none) var(--orbit-space-none);
          color: var(--orbit-color-text-heading);
          font-size: var(--orbit-text-2xl);
          font-weight: var(--orbit-font-weight-bold);
          line-height: var(--orbit-leading-tight);
          overflow-wrap: anywhere;
        }

        .ds-login-form {
          display: flex;
          flex-direction: column;
          width: 100%;
          gap: var(--orbit-space-base);
        }

        .ds-login-label {
          display: flex;
          flex-direction: column;
          width: 100%;
          gap: var(--orbit-space-xs);
          color: var(--orbit-color-text-primary);
          font-size: var(--orbit-text-sm);
          font-weight: var(--orbit-font-weight-medium);
          line-height: var(--orbit-leading-normal);
        }

        .ds-login-input-control {
          width: 100%;
        }

        .ds-login-error {
          margin: var(--orbit-space-none);
          color: var(--orbit-color-text-error);
          font-size: var(--orbit-text-sm);
          line-height: var(--orbit-leading-relaxed);
        }

        .ds-login-submit {
          width: 100%;
        }

        @media (max-width: 600px) {
          .ds-login-panel {
            padding: var(--orbit-space-base) !important;
          }
        }
      `}</style>
      <DitheringShader
        backgroundVar="--orbit-color-bg-canvas"
        className="ds-login-background"
        dataTheme="orbit"
        foregroundAlpha={0.75}
        foregroundVar="--orbit-color-swatch-hollywood-cerise-900"
        pxSize={3}
        shape="wave"
        speed={0.25}
        type="8x8"
      />
      <section
        className="ds-login-panel"
        data-theme="orbit"
        aria-labelledby="design-system-login-title"
      >
        <div className="ds-login-brand">
          <span className="ds-login-mark" aria-hidden="true">O</span>
          <div className="ds-login-brand-text">
            <h1 id="design-system-login-title" className="ds-login-title">Efficio Design System</h1>
          </div>
        </div>

        <form
          className="ds-login-form"
          autoComplete="off"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="ds-login-label">
            <span id="design-system-login-name-label">Name</span>
            <Input
              ariaLabelledBy="design-system-login-name-label"
              autoComplete="off"
              placeholder="Enter your name"
              value={name}
              onChange={(event) => {
                setName(event);
                setError('');
              }}
              style={{ width: '100%' }}
            />
          </div>

          {error && (
            <p role="alert" className="ds-login-error">
              {error}
            </p>
          )}

          <Button
            className="ds-login-submit"
            type="submit"
            variant="Primary"
          >
            Continue
          </Button>
        </form>
      </section>
    </main>
  );
}
