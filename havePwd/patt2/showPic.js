/*
��ģ���Ǹ���ͼƬ·����ȡͼƬת���Base64���벢���imgԪ�ص�
ʳ�÷�����
1�������ģ��
const showPic = require('./showPic'); ��������Ϊ��jsģ��·����
2��ʹ�÷�����ȡͼƬ��html������ֵΪ�ַ������͵�ͼƬhtml
showPic.getPic(ͼƬ·��);
*/
const fs = require('fs');

// ��ȡͼƬBase64����
exports.getPic = function(filePath) {
  try{
    // ��ȴ�ͼƬ���ݶ�ȡ�������ʹ��ͬ�����ļ�����
    const data = fs.readFileSync(filePath, 'binary');
    // ����HTMLͼƬ
    const img = '<img src="'+binToBase64(data)+'"/>'
    return img;
  } catch(err){	
    console.log(err.stack);
  }
}

const binToBase64 = function(data) {
  const picBuffer = Buffer.from(data, 'binary');
// base64������ϡ�data:image/jpeg;base64,������ָBase64ͼƬ������ֵ��imgԪ�ص�src���Լ���չʾ��ͼƬ  
return 'data:image/jpeg;base64,'+picBuffer.toString('base64');
}