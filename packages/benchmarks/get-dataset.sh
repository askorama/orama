wget https://datasets.imdbws.com/title.basics.tsv.gz -P ./dataset
gzip -d ./dataset/title.basics.tsv.gz

head -n1000000 ./dataset/title.basics.tsv >> ./dataset/title.short.tsv

rm ./dataset/title.basics.tsv