export default abstract class Asset {
  static EXTENSIONS: string[] = [];

  filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }
}
