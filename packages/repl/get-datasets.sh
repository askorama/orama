wget https://datasets.imdbws.com/title.episode.tsv.gz -O ./datasets/title.basics.tsv.gz
gzip -d ./datasets/title.basics.tsv.gz
head -n1000000 ./datasets/title.basics.tsv >> ./datasets/title.basics.short.tsv
rm ./datasets/title.basics.tsv