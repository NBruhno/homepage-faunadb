export type Game = {
	cover: {
		url: string,
	},
	id: string,
	developer: Record<string, any>,
	porting: Record<string, any>,
	supporting: Record<string, any>,
	publisher: Record<string, any>,
	name: string,
	screenshot: string | null,
	summary: string,
	genres: Array<string>,
	platforms: Array<string>,
	releaseDate: number,
	releaseDates: Array<number>,
	following: boolean,
}
