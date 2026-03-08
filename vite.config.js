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
