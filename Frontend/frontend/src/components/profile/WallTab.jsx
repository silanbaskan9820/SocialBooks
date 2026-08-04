import PostCard from "../post/PostCard";

const WallTab = ({ posts}) => {
    return (
        <div className="mt-10">

                <h2 className="text-3xl font-bold mb-6">
                    Posts ({posts.length})
                </h2>

                <div className="space-y-6">

                    {posts.length === 0 ? (

                        <div className="text-center text-gray-500">
                            This user hasn't shared any posts yet.
                        </div>

                    ) : (

                        posts.map((post) => (
                        <PostCard
                        key={post._id}
                        post={post}
                        />
                    ))

                    )}

                </div>

            </div>
    )
}

export default WallTab;