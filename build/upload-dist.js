const process = require('process')
const path = require('path')
const COS = require('cos-nodejs-sdk-v5')
const { COS_SID, COS_SK, VITE_BUCKET } = process.env
const sh = require('shelljs')
const glob = require('glob')

if (!(COS_SID && COS_SK)) {
    console.log('!!!!! no cos crediential found, skip upload !!!!!')
    // return
}

//gzip压缩js css 并保留原文件
sh.exec('gzip -krn dist')

const cos = new COS({
    SecretId: COS_SID,
    SecretKey: COS_SK,
})

function uploadFiles(files) {
    cos.uploadFiles(
    {
        files: files.map(function(file) {
            const key = `user-site/${file.replace('dist/', '')}`
            const p= path.join(__dirname, '../', file)
            console.log(p)
            return {
                Bucket: VITE_BUCKET,
                Region: 'ap-beijing',
                Key: key,
                FilePath: p,
            }
        }),
        onProgress: function (info) {
            var percent = parseInt(info.percent * 10000) / 100;
            var speed = parseInt(info.speed / 1024 / 1024 * 100) / 100;
            console.log('进度：' + percent + '%; 速度：' + speed + 'Mb/s;');
        }
    },
    function (err, data) {
        if (err) {
            console.log('上传失败')
            console.log(err || data.files);
        }
        console.log('上传成功')
    }
)
}
glob('dist/**/*.*', (err, files) => {
    uploadFiles(files)
})

