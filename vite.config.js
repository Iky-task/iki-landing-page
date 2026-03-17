import { defineConfig } from 'vite';
import viteImagemin from '@vheemstra/vite-plugin-imagemin';
import imageminGifsicle from '@localnerve/imagemin-gifsicle';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminOptipng from 'imagemin-optipng';
import imageminSvgo from 'imagemin-svgo';
import path from 'path';

export default defineConfig({
    root: '.',
    base: './',
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        minify: false,
        cssMinify: false,
        cssCodeSplit: false,
        base: '',
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'index.html'),
                'auth-callback': path.resolve(__dirname, 'auth-callback.html'),
                'privacy-policy': path.resolve(__dirname, 'privacy-policy.html'),
                'terms-and-conditions': path.resolve(__dirname, 'terms-and-conditions.html'),
                'eula': path.resolve(__dirname, 'eula.html'),
                'account-deletion': path.resolve(__dirname, 'account-deletion.html'),
            },
            output: {
                entryFileNames: 'main.js',
                assetFileNames: ({ name }) => {
                    if (/\.(gif|png|jpe?g|svg|webp)$/.test(name ?? '')) {
                        return 'images/[name].[ext]';
                    }
                    if (/\.(woff2?|eot|ttf|otf)$/.test(name ?? '')) {
                        return 'fonts/[name].[ext]';
                    }
                    if (/\.css$/.test(name ?? '')) {
                        return '[name].[ext]';
                    }
                    return 'assets/[name].[ext]';
                },
            },
        },
        assetsInlineLimit: 0,
    },
    plugins: [
        {
            name: 'remove-crossorigin',
            transformIndexHtml: {
                order: 'post',
                handler: html => html.replace(/ crossorigin/gi, ''),
            },
        },
        {
            name: 'remove-css-from-auth-callback',
            transformIndexHtml: {
                order: 'post',
                handler: (html, ctx) => {
                    // Remove style.css link from auth-callback.html
                    if (ctx.filename && ctx.filename.includes('auth-callback')) {
                        return html.replace(/<link[^>]*href="[^"]*style\.css"[^>]*>/gi, '');
                    }
                    return html;
                },
            },
        },
        viteImagemin({
            plugins: {
                gif: imageminGifsicle({ interlaced: true }),
                jpg: imageminMozjpeg({ progressive: true }),
                png: imageminOptipng({ optimizationLevel: 5 }),
                svg: imageminSvgo({ plugins: [{ name: 'preset-default' }] }),
            },
            onlyAssets: true,
            verbose: true,
        }),
    ],
    resolve: {
        alias: {
            '@scripts': path.resolve(__dirname, 'src/scripts'),
        },
    },
    server: {
        port: 9000,
        open: true,
        watch: {
            usePolling: true,
        },
    },
    preview: {
        port: 9000,
    },
});
