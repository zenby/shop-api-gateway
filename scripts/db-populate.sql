create extension if not exists "uuid-ossp";

create table product (
	id uuid not null default uuid_generate_v4() unique,
	title text not null primary key,
	description text,
	price float not null
);

create table store (
	product_id uuid primary key references product(id) on delete cascade not null,
	amount integer not null default 0
);

insert into product (title, description, price) values
	('NFT hallows', 'Unbelievable hallows', '23.45'),
	('NFT ortodox crypto token', 'Crypto token that you have never seen', '9.99'),
	('Etherium NFT Wailing Wall', 'Think a bit about etherium nft wailing wall', '10.12'),
	('NFT candle', 'Just a single candle', '55.66'),
	('NFT Cyber sacred image', 'Sacred incognito image', '666.00'),
	('Bitcoin sacred cross', 'Bitcoid cross the same as Dominik Toreto cross', '45.67'),
	('NFT blockchain catholic poster', 'NFT poster on the wall', '455.78'),
	('Blockchain NFT sacred image', 'Just a simple image', '23.67'),
	('Cyber blockchain NFT sacred image', 'Cyber image to show your friends and relatives', '15.46');

insert into store (product_id)
select id from product;
