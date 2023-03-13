<h2 align="center">Make It Safer</h2>
<p align="center"><i>Move vulnerabilities away. Make your project <ins>safer</ins>.</i></p>

### Introduction

This package will fix other package known vulnerabilities by updating the version of the package to a stable, not vulnerable, version.
This package do this based on `npm audit fix`, but better and ready to be implemented on **automated pipelines**.

### Install

```shell
   npm i make-it-safer -D
```

---

### Usage

```shell
   npx make-it-safer
```

---

### Options

By default, the package fix all known vulnerabilities, but it can be used also to upgrade dependencies versions. See below:

#### - Update dependencies to the latest version

```shell
   npx make-it-safer --latest
```

#### - Update dependencies to the latest major version

```shell
   npx make-it-safer --major
```

#### - Update dependencies to the latest minor version

```shell
   npx make-it-safer --minor
```

#### - Update dependencies to the latest patch version

```shell
   npx make-it-safer --patch
```

---

### Pipelines

This package is ready to be implemented on automated pipelines and git flow. You can use this way:

- With [Husky](https://www.npmjs.com/package/husky)
  - `npx make-it-safer && git add -A .` (use on the pre-commit hook)(can delay commit time)
- With pipelines
  - `npx make-it-safer && git add -A . && git commit -m "(ci): fixed vulnerabilities" && git push`

---

### Aliases

```shell
   npx make-it-safer
   npx makeitsafer
   npx mis
```

---

### Contributions

- The vulnerabilities fix scripts were made by [taylorho](https://github.com/TaylorHo).
- The packages updating scripts were made by [wellwelwel](https://github.com/wellwelwel), on the package [packages-update](https://github.com/wellwelwel/packages-update). thanks!

### FOSS

Have an idea of improvement? Open an [issue](https://github.com/TaylorHo/make-it-safe/issues/new) or a [Pull Request](https://github.com/TaylorHo/make-it-safe/fork)! We are happily waiting your contribution :)
