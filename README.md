<br/>
<p align="center">
  <h3 align="center">Filen Web</h3>

  <p align="center">
    Web and Desktop Frontend for Filen.
    <br/>
    <br/>
  </p>
</p>

![Contributors](https://img.shields.io/github/contributors/FilenCloudDienste/filen-web?color=dark-green) ![Forks](https://img.shields.io/github/forks/FilenCloudDienste/filen-web?style=social) ![Stargazers](https://img.shields.io/github/stars/FilenCloudDienste/filen-web?style=social) ![Issues](https://img.shields.io/github/issues/FilenCloudDienste/filen-web) ![License](https://img.shields.io/github/license/FilenCloudDienste/filen-web)

### Installation and building

1. Clone repository

```sh
git clone https://github.com/FilenCloudDienste/filen-web filen-web
```

2. Update dependencies

```sh
cd filen-web && npm install
```

3. Running a development build

```sh
npm run dev
```

4. Build

```sh
npm run build
```

## Drive aliases

The web client now includes a local alias system. Using the `useDriveAliases`
hook you can create alias categories, assign drive items to them and remove
them again. Alias information is persisted through the worker using
`IndexedDB` so it survives reloads.

From a drive item's context menu you can add or remove aliases or create new
ones. The item information dialog lists all aliases assigned to the item.

## License

Distributed under the AGPL-3.0 License. See [LICENSE](https://github.com/FilenCloudDienste/filen-s3/blob/main/LICENSE.md) for more information.
