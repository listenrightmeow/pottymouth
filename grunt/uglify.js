module.exports = {
	dist : {
		options : {
			drop_console : true,
			sourceMap : true,
			sourceMapName : './dist/pottymouth.map'
		},
		files : {
			'dist/pottymouth.min.js' : ['./pottymouth.js']
		}
	}
}